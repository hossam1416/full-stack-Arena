"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const emptyForm = { title: "", content: "", image: "", published: false };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // change this number to load the list again
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((key) => key + 1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");

  // load all announcements (the admin gets published and draft ones)
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await apiRequest("/announcements");
        setAnnouncements(data.announcements || []);
      } catch (err) {
        setError(err.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, [reloadKey]);

  const openAddForm = () => {
    setEditingAnnouncement(null);
    setFormData(emptyForm);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || "",
      content: announcement.content || "",
      image: announcement.image || "",
      published: announcement.published,
    });
    setFormError("");
    setFormOpen(true);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingAnnouncement) {
        await apiRequest(`/announcements/${editingAnnouncement._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        setMessage("Announcement updated");
      } else {
        await apiRequest("/announcements", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setMessage("Announcement created");
      }

      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message || "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  // publish / unpublish: send only the "published" field
  const handleTogglePublished = async (announcement) => {
    try {
      await apiRequest(`/announcements/${announcement._id}`, {
        method: "PUT",
        body: JSON.stringify({ published: !announcement.published }),
      });

      setMessage(
        announcement.published
          ? "Announcement unpublished"
          : "Announcement published",
      );
      reload();
    } catch (err) {
      setError(err.message || "Failed to update announcement");
    }
  };

  const openDeleteDialog = (announcement) => {
    setDeleteError("");
    setAnnouncementToDelete(announcement);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError("");

      await apiRequest(`/announcements/${announcementToDelete._id}`, {
        method: "DELETE",
      });

      setAnnouncementToDelete(null);
      setMessage("Announcement deleted");
      reload();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete announcement");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Manage Announcements"
        subtitle="Create and manage announcements shown to players."
        action={
          <Button variant="contained" onClick={openAddForm}>
            Add Announcement
          </Button>
        }
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {announcements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No announcements yet.</TableCell>
                </TableRow>
              )}

              {announcements.map((announcement) => (
                <TableRow key={announcement._id}>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {announcement.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={announcement.published ? "Published" : "Draft"}
                      color={announcement.published ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    {announcement.createdBy?.username || "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => openEditForm(announcement)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleTogglePublished(announcement)}
                      >
                        {announcement.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => openDeleteDialog(announcement)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* add / edit form */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingAnnouncement ? "Edit Announcement" : "Add Announcement"}
        </DialogTitle>

        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={5}
              fullWidth
            />
            <TextField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              fullWidth
            />
            <FormControlLabel
              label="Published"
              control={
                <Switch
                  checked={formData.published}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      published: event.target.checked,
                    })
                  }
                />
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving
              ? "Saving..."
              : editingAnnouncement
                ? "Save Changes"
                : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(announcementToDelete)}
        title="Delete Announcement"
        message={`Are you sure you want to delete ${announcementToDelete?.title ?? ""}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => setAnnouncementToDelete(null)}
      />

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={message}
      />
    </Container>
  );
}
